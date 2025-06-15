from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),                # GET / -> pagina index.html
    path('embeddings/generate/', views.generate_embedding, name='generate_embedding'),  # API
]
