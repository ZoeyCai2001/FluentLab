from __future__ import annotations

import json
from pathlib import Path
from threading import Lock

from .models import AppState, DailyPlan, LearningTask, Mistake, TaskStatus
from .seed import build_seed_state


class JsonStateStore:
    def __init__(self, data_path: Path) -> None:
        self.data_path = data_path
        self._lock = Lock()

    def load(self) -> AppState:
        if not self.data_path.exists():
            return build_seed_state()

        payload = json.loads(self.data_path.read_text(encoding="utf-8"))
        return self._merge_seed_state(AppState.model_validate(payload))

    def save(self, state: AppState) -> AppState:
        with self._lock:
            self.data_path.parent.mkdir(parents=True, exist_ok=True)
            temp_path = self.data_path.with_suffix(".tmp")
            temp_path.write_text(
                json.dumps(state.model_dump(mode="json"), indent=2),
                encoding="utf-8",
            )
            temp_path.replace(self.data_path)
        return state

    def update_task_status(self, task_id: str, status: TaskStatus) -> DailyPlan | None:
        state = self.load()
        updated_tasks: list[LearningTask] = []
        found = False

        for task in state.daily_plan.tasks:
            if task.id == task_id:
                updated_tasks.append(task.model_copy(update={"status": status}))
                found = True
            else:
                updated_tasks.append(task)

        if not found:
            return None

        completed = sum(1 for task in updated_tasks if task.status == TaskStatus.DONE)
        completion_rate = completed / len(updated_tasks) if updated_tasks else 0
        state.daily_plan = state.daily_plan.model_copy(
            update={
                "tasks": updated_tasks,
                "completion_rate": completion_rate,
            }
        )
        self.save(state)
        return state.daily_plan

    def add_mistake(self, mistake: Mistake) -> list[Mistake]:
        state = self.load()
        existing_ids = {item.id for item in state.mistakes}
        if mistake.id not in existing_ids:
            state.mistakes.append(mistake)
            self.save(state)
        return state.mistakes

    def _merge_seed_state(self, state: AppState) -> AppState:
        seed = build_seed_state(state.daily_plan.plan_date)
        existing_task_status = {task.id: task.status for task in state.daily_plan.tasks}
        merged_tasks = [
            task.model_copy(update={"status": existing_task_status.get(task.id, task.status)})
            for task in seed.daily_plan.tasks
        ]

        existing_vocabulary = {item.id: item for item in state.vocabulary}
        existing_mistakes = {item.id: item for item in state.mistakes}
        existing_resources = {item.id: item for item in state.resources}

        state.daily_plan = seed.daily_plan.model_copy(
            update={
                "target_minutes": state.settings.daily_study_target_minutes,
                "tasks": merged_tasks,
                "total_estimated_minutes": sum(task.minutes for task in merged_tasks),
                "completion_rate": (
                    sum(1 for task in merged_tasks if task.status == TaskStatus.DONE)
                    / len(merged_tasks)
                ),
            }
        )
        state.vocabulary = list({**{item.id: item for item in seed.vocabulary}, **existing_vocabulary}.values())
        state.mistakes = list({**{item.id: item for item in seed.mistakes}, **existing_mistakes}.values())
        state.resources = list({**{item.id: item for item in seed.resources}, **existing_resources}.values())
        if not state.progress:
            state.progress = seed.progress
        return state
