"""empty message

Revision ID: e6dbd0b089d
Revises: aa49a4f73fc
Create Date: 2015-04-30 03:02:02.435498

"""

# revision identifiers, used by Alembic.
revision = 'e6dbd0b089d'
down_revision = 'aa49a4f73fc'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    conn = op.get_bind()
    conn.execute("ALTER TABLE locations ALTER COLUMN lat TYPE FLOAT USING (lon::float)")


def downgrade():
    pass
