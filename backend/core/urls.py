from django.contrib import admin
from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from graphene_django.views import GraphQLView
from django.conf.urls.static import static
from django.conf import settings
import views


admin.site.site_header = "CULD Hub Admin Panel"
admin.site.site_title = "CULD Hub"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path(".*", TemplateView.as_view(template_name="index.html")),
    path( "upload/", views.upload, name = 'jfu_upload' ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
