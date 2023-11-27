from django.urls import path

from api.v1.customer_api.views import MemberList, ChatMessages, GroupChatList, GroupChatMessages, UserList, MemberRemove, ProfileView


urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("all/users/", UserList.as_view(), name="user-list"),
    path("members/", MemberList.as_view(), name="members"),
    path("member/remove/<int:id>/", MemberRemove.as_view(), name="member_remove"),
    path("member/chat-messages/<int:id>/", ChatMessages.as_view(), name="chat-messages"),
    path("member/group-list/", GroupChatList.as_view(), name="group-list"),
    path("member/group-chat-messages/<int:id>/", GroupChatMessages.as_view(), name="group-chat-messages"),
]