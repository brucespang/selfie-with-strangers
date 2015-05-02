"""empty message

Revision ID: 4e2935313eda
Revises: 1cf83012a8d2
Create Date: 2015-04-30 03:27:40.467993

"""

# revision identifiers, used by Alembic.
revision = '4e2935313eda'
down_revision = '1cf83012a8d2'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    conn = op.get_bind()
    conn.execute("ALTER TABLE proposals ALTER COLUMN location TYPE TEXT USING (''::text)")
    op.drop_column('proposals', 'tile')


def downgrade():
    pass
