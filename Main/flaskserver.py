from flask import Flask, request, redirect, url_for, render_template, abort, \
    send_from_directory
from werkzeug.utils import secure_filename   # import for secure file name processing
import os

# import loginmanager.py

app = Flask(__name__)
app.config['UPLOAD_PATH'] = os.path.join(os.path.dirname(__file__), '../uploads')
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000 * 10  # max file upload size of 10 mb.
Allowed_File_Extensions = {'jpg', 'png', 'jpeg'}

if not os.path.exists(app.config['UPLOAD_PATH']):
    os.makedirs(app.config['UPLOAD_PATH'])

# Template loaders
@app.route('/')
def index():
    """loads map.html for flask"""
    return render_template('map.html')

@app.route('/marker')
def marker():
    """initializes marker.html for flask"""
    files = os.listdir(app.config['UPLOAD_PATH'])   # define parameter for marker.html
    return render_template('marker.html', files=files)

@app.route('/loginpage')
def login_page():
    return render_template('loginpage.html')

@app.route('/homepage')
def homepage():
    return render_template('homepage.html')


# Helper Functions
def rename_file(directory: str):
    # rename files to include a user id.
    print("placeholder")

def allowed_file(filename):
    """check if submitted file is valid."""
    return '.' in filename and \
        filename.split('.', 1)[1].lower() in Allowed_File_Extensions


# Upload Functions
@app.route('/marker', methods=['POST'])
def upload_file():
    """Uploads files to /uploads and processes errors and malicious filenames"""
    valid_upload_submitted = False

    if 'image_file' not in request.files:
        print("No valid files submitted! (Reloading)")
        return redirect(url_for('marker'))

    for upload in request.files.getlist('image_file'):
        filename = secure_filename(upload.filename)   # cleans malicious filenames
        if filename == '':
            print("Error: Blank File!")
            continue   # Skip blank files (check if this is bad!)

        if upload and allowed_file(filename):
            if filename:   # NOTE: Redundant check?
                filepath = os.path.join(app.config['UPLOAD_PATH'], filename)
                upload.save(filepath)
                valid_upload_submitted = True
    
    if (valid_upload_submitted): # NOTE: DEBUG test
        print("File(s) Uploaded Successful!")
    
    return redirect(url_for('marker'))

@app.route('/uploads/<filename>')
def upload(filename): # need to rename for clarity.
    """Handles pushing image files to marker.html to display."""
    print(f"Attempting to fetch: {filename}")
    try:
        return send_from_directory(app.config['UPLOAD_PATH'], filename)  
    except:
        print(f"Failed to fetch: {filename}!")

# Login Managers
"""
@login_required # flask decorator for a login requirement.
def login():
"""
if __name__ == '__main__':
    app.run(debug=True)
