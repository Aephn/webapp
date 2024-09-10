from flask import Flask, request, redirect, url_for, render_template, abort, \
    send_from_directory
import os

# @login_required # flask decorator for a login requirement.