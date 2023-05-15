module.exports = {
    isOwner:function(request, response) {
        if (request.user) { //로그인 되어있다면 request에 유저객체가 있을 것임(deserialize함수 덕분에)
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if (this.isOwner(request, response)) {
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}