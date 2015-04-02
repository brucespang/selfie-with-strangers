from flask import jsonify
from flask import request, redirect, Response
from werkzeug.exceptions import HTTPException

def make_json_error(ex):
    response = jsonify(message=str(ex))
    response.status_code = (ex.code
                            if isinstance(ex, HTTPException)
                            else 500)
    return response
