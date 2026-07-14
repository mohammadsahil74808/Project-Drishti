import uuid
from sqlalchemy import String, Float, ForeignKey
from geoalchemy2 import Geography
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class District(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "districts"
    
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    boundary: Mapped[str] = mapped_column(Geography(geometry_type="POLYGON", srid=4326), nullable=True)


class Station(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "stations"
    
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    district_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
