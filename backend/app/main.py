from __future__ import annotations

import secrets
from pathlib import Path

from fastapi import Request
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from .config import Settings
from .models import (
    AuthStatusResponse,
    DailyPlan,
    LearnerProfile,
    LoginRequest,
    LoginResponse,
    Mistake,
    ResourceItem,
    SpeakingPolishRequest,
    SpeakingPolishResponse,
    TaskStatusUpdate,
    UserSettings,
    VocabularyItem,
    WritingFeedbackRequest,
    WritingFeedbackResponse,
)
from .services.feedback import polish_speaking, review_writing
from .store import JsonStateStore


def create_app(data_path: Path | None = None, *, disable_auth: bool = False) -> FastAPI:
    settings = Settings()
    if data_path is not None:
        settings.data_path = data_path
    if disable_auth:
        settings.shared_password = None
        settings.auth_token = None

    app = FastAPI(title=settings.app_name)
    app.state.store = JsonStateStore(settings.data_path)
    app.state.auth_token = settings.auth_token or secrets.token_urlsafe(32)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def require_auth(request: Request, call_next):
        public_paths = {"/health", "/api/auth/status", "/api/auth/login"}
        if (
            settings.shared_password
            and request.url.path.startswith("/api/")
            and request.url.path not in public_paths
            and request.method != "OPTIONS"
        ):
            token = request.headers.get("x-fluentlab-token", "")
            if token != app.state.auth_token:
                return JSONResponse({"detail": "Authentication required"}, status_code=401)
        return await call_next(request)

    def get_store() -> JsonStateStore:
        return app.state.store

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "fluentlab-api"}

    @app.get("/api/auth/status", response_model=AuthStatusResponse)
    def get_auth_status() -> AuthStatusResponse:
        return AuthStatusResponse(auth_required=bool(settings.shared_password))

    @app.post("/api/auth/login", response_model=LoginResponse)
    def login(payload: LoginRequest) -> LoginResponse:
        if not settings.shared_password:
            return LoginResponse(token=app.state.auth_token)
        if not secrets.compare_digest(payload.password, settings.shared_password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        return LoginResponse(token=app.state.auth_token)

    @app.get("/api/profile", response_model=LearnerProfile)
    def get_profile(store: JsonStateStore = Depends(get_store)) -> LearnerProfile:
        return store.load().profile

    @app.put("/api/profile", response_model=LearnerProfile)
    def update_profile(
        profile: LearnerProfile,
        store: JsonStateStore = Depends(get_store),
    ) -> LearnerProfile:
        state = store.load()
        state.profile = profile
        store.save(state)
        return profile

    @app.get("/api/settings", response_model=UserSettings)
    def get_settings(store: JsonStateStore = Depends(get_store)) -> UserSettings:
        return store.load().settings

    @app.put("/api/settings", response_model=UserSettings)
    def update_settings(
        user_settings: UserSettings,
        store: JsonStateStore = Depends(get_store),
    ) -> UserSettings:
        state = store.load()
        state.settings = user_settings
        state.daily_plan = state.daily_plan.model_copy(
            update={"target_minutes": user_settings.daily_study_target_minutes}
        )
        store.save(state)
        return user_settings

    @app.get("/api/plans/today", response_model=DailyPlan)
    def get_today_plan(store: JsonStateStore = Depends(get_store)) -> DailyPlan:
        return store.load().daily_plan

    @app.patch("/api/tasks/{task_id}", response_model=DailyPlan)
    def update_task_status(
        task_id: str,
        payload: TaskStatusUpdate,
        store: JsonStateStore = Depends(get_store),
    ) -> DailyPlan:
        plan = store.update_task_status(task_id, payload.status)
        if plan is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return plan

    @app.get("/api/vocabulary", response_model=list[VocabularyItem])
    def get_vocabulary(store: JsonStateStore = Depends(get_store)) -> list[VocabularyItem]:
        return store.load().vocabulary

    @app.get("/api/mistakes", response_model=list[Mistake])
    def get_mistakes(store: JsonStateStore = Depends(get_store)) -> list[Mistake]:
        return store.load().mistakes

    @app.post("/api/mistakes", response_model=list[Mistake])
    def add_mistake(
        mistake: Mistake,
        store: JsonStateStore = Depends(get_store),
    ) -> list[Mistake]:
        return store.add_mistake(mistake)

    @app.get("/api/resources", response_model=list[ResourceItem])
    def get_resources(store: JsonStateStore = Depends(get_store)) -> list[ResourceItem]:
        return store.load().resources

    @app.get("/api/progress/weekly")
    def get_weekly_progress(store: JsonStateStore = Depends(get_store)) -> dict[str, object]:
        state = store.load()
        total_minutes = sum(point.minutes for point in state.progress)
        total_completed = sum(point.completed for point in state.progress)
        return {
            "points": state.progress,
            "total_minutes": total_minutes,
            "completed_tasks": total_completed,
            "recommended_focus": ["Speaking", "Listening", "Writing"],
        }

    @app.post("/api/speaking/polish", response_model=SpeakingPolishResponse)
    def polish_speaking_attempt(payload: SpeakingPolishRequest) -> SpeakingPolishResponse:
        return polish_speaking(payload.topic, payload.transcript)

    @app.post("/api/writing/feedback", response_model=WritingFeedbackResponse)
    def review_writing_attempt(payload: WritingFeedbackRequest) -> WritingFeedbackResponse:
        return review_writing(payload.prompt, payload.draft)

    return app


app = create_app()
