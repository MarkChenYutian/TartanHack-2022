from firebase_admin import initialize_app, credentials
from firebase_admin import firestore
from firebase_admin import storage

# initialize
cred = credentials.Certificate("./security/adminsdk.json")
initialize_app(cred, {'projectId': 'the-fence-340405', 'storageBucket': 'the-fence-340405.appspot.com'})

# db = firestore.client()

# doc_ref = db.collection('users').document('alovelace')
# doc_ref.set({'first': 'Ada', 'last': 'Lovelace', 'born': 1815})

# users_ref = db.collection('users')
# docs = users_ref.stream()
#
# for doc in docs:
#     print(f'{doc.id} => {doc.to_dict()}')

# bucket = storage.bucket()
# fileName = "TartanHack.png"
# blob = bucket.blob(fileName)
# blob.upload_from_filename(fileName)
# blob.make_public()
# print("your file url", blob.public_url)
