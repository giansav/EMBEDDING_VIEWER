# importazioni necessarie
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import numpy as np
from sklearn.decomposition import PCA
from sentence_transformers import SentenceTransformer



# utilizzo del pacchetto SentenceTransfomer
model = SentenceTransformer('all-MiniLM-L6-v2')



# view per renderizzare la pagina index.html dopo la richiesta del browser
def home(request):
    return render(request, 'embeddings/index.html')



# view per generare l'embedding dei testi immessi nelle caselle di input
@api_view(['POST'])
def generate_embedding(request):
    text1 = request.data.get('text1', '')
    text2 = request.data.get('text2', '')

    if not text1 or not text2:
        return Response({'error': 'Entrambi i testi devono essere forniti'}, status=400)

    # embedding dei testi dell'utente
    emb1 = model.encode(text1)
    emb2 = model.encode(text2)

    # norme dei vettori
    norm_1 = float(np.linalg.norm(emb1))
    norm_2 = float(np.linalg.norm(emb2))

    # calcolo della Cosine similarity
    cosine_similarity = float(np.dot(emb1, emb2) / (norm_1 * norm_2))

    # frasi di background per rendere la PCA più stabile
    # (con solo i testi di input i vettori risultano sempre collineari 
    # e le potenzialità del 2D non vengono sfruttate appieno)
    background_sentences = [
        "Il cielo è coperto da nuvole scure.",
        "Il gatto osserva i passanti dalla finestra.",
        "L’intelligenza artificiale sta cambiando il mondo.",
        "Il treno è arrivato in perfetto orario.",
        "La pizza è uno dei piatti più amati al mondo.",
        "I bambini giocano a calcio nel parco.",
        "Il sole tramonta dietro le colline.",
        "Le tecnologie moderne avanzano rapidamente.",
        "La musica rilassa l’anima nei momenti difficili.",
        "L’acqua del lago è limpida e fredda.",
        "L’economia globale è in continua evoluzione.",
        "Il cane corre felice sulla spiaggia.",
        "Molte persone leggono libri prima di dormire.",
        "Il computer è acceso da stamattina.",
        "Le montagne sono coperte di neve fresca.",
        "La scienza offre risposte ai grandi misteri.",
        "Il caffè ha un profumo intenso al mattino.",
        "Gli uccelli migrano verso sud in autunno.",
        "Lo sport è importante per la salute fisica.",
        "I film comici fanno ridere grandi e piccoli.",
        "Il tempo scorre lentamente in vacanza.",
        "La tecnologia 5G sta rivoluzionando le comunicazioni.",
        "Le foglie cadono leggere dagli alberi.",
        "Il mare ha riflessi dorati al tramonto.",
        "La pandemia ha cambiato molte abitudini quotidiane.",
        "La matematica è alla base di molte discipline.",
        "Il vento muove le tende con delicatezza.",
        "Le stelle brillano luminose nel cielo notturno.",
        "I robot stanno entrando nelle case moderne.",
        "La scuola è un luogo di crescita e conoscenza."
    ]

    background_embeddings = model.encode(background_sentences)

    # costruzione della matrice per la Principal Component Analysis (PCA)
    # che semplifica un vettore di 384 dimensioni in un vettore di 2 sole componenti
    all_embeddings = np.vstack([background_embeddings, emb1, emb2])
    pca = PCA(n_components=2)
    embeddings_2d = pca.fit_transform(all_embeddings)

    # costruzione di una versione 2D dei due input immessi dall'utente
    emb_2d_1 = embeddings_2d[-2].tolist()
    emb_2d_2 = embeddings_2d[-1].tolist()

    # calcolo della distanza euclidea in 2D tra i due vettori
    distance = float(np.linalg.norm(embeddings_2d[-2] - embeddings_2d[-1]))

    # dati necessari al file JS per generare l'output
    return Response({
        'embedding_2d_1': emb_2d_1,
        'embedding_2d_2': emb_2d_2,
        'distance': distance,
        'cosine_similarity': cosine_similarity,
        'norm_1': norm_1,
        'norm_2': norm_2
    })
