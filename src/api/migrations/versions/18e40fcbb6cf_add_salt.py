"""empty message

Revision ID: 18e40fcbb6cf
Revises: 32d34fe1baa0
Create Date: 2015-04-20 17:37:50.002398

"""

# revision identifiers, used by Alembic.
revision = '18e40fcbb6cf'
down_revision = '32d34fe1baa0'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.add_column('users', sa.Column('password_salt', sa.String(length=192), nullable=False))

def downgrade():
    op.drop_column('users', 'password_salt')
