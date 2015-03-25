module.exports = (function() {
		var users = [
				{
						id: "428e1620-d2f9-11e4-b9d6-1681e6b88ec1",
						name: "Dennis Sutton",
						avatar_url: "/img/avatar.png",
				},
				{
						id: "428e1864-d2f9-11e4-b9d6-1681e6b88ec1",
						name: "Betty Daily",
						avatar_url: "/img/avatar.png",
				},
		]

		var questions = [
				{
						id: "7dc55158-d2fa-11e4-b9d6-1681e6b88ec1",
						question: "What is your selfie partner's deepest fear?"
				},
				{
						id: "8793eece-d2fa-11e4-b9d6-1681e6b88ec1",
						question: "If your selfie partner had a memoir, what would it be titled?"
				}
		]

		return {
				users: {
						nearby: function() {
								return users;
						},
						show: function(uid) {
								return users.filter(function(u) {return u.id == uid})[0]
						}
				},
				questions: {
						random: function() {
								return questions[Math.floor(Math.random()*questions.length)]
						}
				},
		}
})()
