VISUALIZZATORE DI EMBEDDING

Questa app consente all'utente di inserire 2 testi e di valutare graficamente la distanza tra i loro embedding in uno spazio in due dimensioni.
Tramite SentenceTransformer l'app genera embedding di 384 dimensioni per ogni testo inserito, li semplifica tramite Principal Component Analysis (PCA) in vettori di 2 dimneisoni
e li rappresenta graficamente in un piano cartesiano, mostrando i dati sulla loro lunghezza, la loro distanza euclidea e la loro cosine similarity.
Anche il colore dei due vettori codifica semanticamente la loro cosine similarity.

L'app è realizzata con Django (Python + JS + HTML + CSS).

Ogni commento o suggerimento è benvenuto.
