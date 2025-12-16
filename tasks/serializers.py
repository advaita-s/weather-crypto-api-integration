from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ['id','username','email','password']

    def create(self, validated_data):
        user = User(username=validated_data['username'], email=validated_data.get('email',''))
        user.set_password(validated_data['password'])
        user.save()
        return user

class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Task
        fields = ['id','owner','title','description','completed','created_at','due_date']
