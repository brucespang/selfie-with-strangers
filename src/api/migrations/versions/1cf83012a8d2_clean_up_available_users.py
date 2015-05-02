"""empty message

Revision ID: 1cf83012a8d2
Revises: e6dbd0b089d
Create Date: 2015-04-30 03:23:35.545694

"""

# revision identifiers, used by Alembic.
revision = '1cf83012a8d2'
down_revision = 'e6dbd0b089d'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.add_column('available_users', sa.Column('user_id', sa.String(), nullable=False))
    op.drop_column('available_users', 'username')
    op.drop_column('available_users', 'tile_id')
    op.drop_column('available_users', 'tile_name')


def downgrade():
    op.add_column('available_users', sa.Column('tile_name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('available_users', sa.Column('tile_id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('available_users', sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_column('available_users', 'user_id')
