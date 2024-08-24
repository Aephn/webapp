from flask import Flask, request, redirect, url_for, render_template, abort, \
    send_from_directory
from werkzeug.utils import secure_filename   # import for secure file name processing
import os

app = Flask(__name__)
app.config['UPLOAD_PATH'] = os.path.join(os.path.dirname(__file__), '../uploads')
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000   # max file upload size of 1 mb.
Allowed_File_Extensions = {'jpg', 'png', 'jpeg'}


if not os.path.exists(app.config['UPLOAD_PATH']):
    os.makedirs(app.config['UPLOAD_PATH'])


# file initalizations
@app.route('/')
def index():
    """loads map.html for flask"""
    return render_template('map.html')

@app.route('/marker')
def marker():
    """initializes marker.html for flask"""
    files = os.listdir(app.config['UPLOAD_PATH'])   # define parameter for marker.html
    return render_template('marker.html', files=files)


# process files and ensure uploads are secure.
@app.route('/marker', methods=['POST'])
def upload_file():
    """Uploads files to /uploads and processes errors and malicious filenames"""
    valid_upload_submitted = False
    
    DEBUG_filecount_iterable = 0
    print("DEBUG: Upload function called")   # debug

    if 'image_file' not in request.files:
        print("No valid files submitted! Reloading.")
        return redirect(url_for('marker'))

    for upload in request.files.getlist('image_file'):  # NOTE: Needs to change the error message.
        if upload.filename == '':
            print("Error: Blank File!")
            continue   # check if this is bad!
            # return 'Error: Blank File!'

        if upload and allowed_file(upload.filename):
            filename = secure_filename(upload.filename)   # cleans possible malicious filenames
            
            if (filename):
                filepath = os.path.join(app.config['UPLOAD_PATH'], filename)
                upload.save(filepath)

                print(f"DEBUG: File #{DEBUG_filecount_iterable} saved: {filepath}")
                DEBUG_filecount_iterable+=1
                valid_upload_submitted = True
    
    # handle if all files submitted are invalid
    if (valid_upload_submitted):
        print("File(s) Uploaded Successful!")
        return redirect(url_for('marker'))  # defines which html to return to
    else:
        abort(418)   # I'm a teapot (NOT FOR RELEASE)

def allowed_file(filename):
    """check if submitted file is valid."""
    return '.' in filename and \
        filename.split('.', 1)[1].lower() in Allowed_File_Extensions

@app.route('/uploads/<filename>')
def upload(filename):
    """Handles pushing complete file extensions to marker.html to display."""
    print(f"Attempting to fetch: {filename}")
    try:
        return send_from_directory(app.config['UPLOAD_PATH'], filename)  
    except:
        print(f"Failed to fetch: {filename}!")
    
# @login_required # flask decorator for a login requirement.

if __name__ == '__main__':
    app.run(debug=True)