from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename   # import for secure file name processing
import os

# maybe good to look into: https://flask-wtf.readthedocs.io/en/1.2.x/
# might help me simplify some things here in regard to the flask server.
# Helpful: https://blog.miguelgrinberg.com/post/handling-file-uploads-with-flask

app = Flask(__name__)
app.config['UPLOAD_PATH'] = 'uploads/'   # define an upload folder
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000 # max file upload size of 1 mb.
Allowed_File_Extensions = {'jpg', 'png', 'jpeg'}


# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_PATH']):
    os.makedirs(app.config['UPLOAD_PATH'])

def allowed_file(filename):   # check if the file submitted is valid.
    return '.' in filename and \
        filename.split('.', 1)[1].lower() in Allowed_File_Extensions


@app.route('/')
def index():
    return render_template('maptile.html')   # load html template


@app.route('/upload', methods=['POST'])
def upload_file():
    valid_upload_submitted = False
    
    DEBUG_filecount_iterable = 0
    print("Upload function called")   # debug

    if 'image_file' not in request.files:
        print("No files!")
        return 'No files!'

    for upload in request.files.getlist('image_file'):
        if upload.filename == '':
            print("Error: Blank File!")
            continue   # check if this is bad!
            # return 'Error: Blank File!'
    
        if upload and allowed_file(upload.filename):
            filename = secure_filename(upload.filename)   # cleans possible malicious filenames 

            filepath = os.path.join(app.config['UPLOAD_PATH'], filename)
            upload.save(filepath)

            print(f"DEBUG: File #{DEBUG_filecount_iterable} saved: {filepath}")
            DEBUG_filecount_iterable+=1

            # return render_template('maptile.html') # works to re-load webpage, but markers aren't stored.

            valid_upload_submitted = True
    
    if (valid_upload_submitted):
        return f'File(s) uploaded successfully!'
    else:
        return 'No Valid Files Submitted'

if __name__ == '__main__':
    app.run(host="localhost", debug=True)   