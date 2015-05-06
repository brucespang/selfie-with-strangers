"""empty message

Revision ID: 3169dcd4c8c0
Revises: faa87b27e92
Create Date: 2015-05-06 22:57:07.001519

"""

# revision identifiers, used by Alembic.
revision = '3169dcd4c8c0'
down_revision = 'faa87b27e92'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    conn = op.get_bind()
    conn.execute("""
    INSERT INTO locations (id, name, lat, lon) VALUES ('392d993a-f43b-11e4-a988-080027a9eca2', 'Minuteman Statue', 42.389287, -72.527299);
    """)

def downgrade():
    pass
