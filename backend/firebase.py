from firebase_admin import initialize_app, credentials
from firebase_admin import firestore
from firebase_admin import storage

# initialize
cred = credentials.Certificate("./security/adminsdk.json")
initialize_app(cred, {'projectId': 'the-fence-340405', 'storageBucket': 'the-fence-340405.appspot.com'})
client = firestore.client()
bucket = storage.bucket()


def upload_image(filename: str):
    blob = bucket.blob(f'images/{filename}')
    blob.upload_from_filename(filename)
    return blob.public_url


def download_image(filename: str):
    blob = bucket.blob(f'images/{filename}')
    blob.download_to_filename(filename)
    return filename

