import axios from 'axios'

const AXIOS = axios.create({
    baseURL: "/api",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'DELETE, POST, GET, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    }
});

export default {
    getUsers() {
        return AXIOS.get(
            "/users/all",
        );
    },
    getUser(userId) {
        return AXIOS.get("/users/" + userId);
    },
    deleteUser(userId, token) {
        return AXIOS.delete(
            "/users/" + userId,
            {
            	data: {
								token: token
							}
            }
        );
    },
    createUser(username, password) {
        return AXIOS.post("/users",  // returns user id
            {
                username: username,
                password: password
            }
        );
    },
    getSecured(username, password) {
        return AXIOS.get(
            "/login",
            {
                auth: {
                    username: username,
                    password: password
                },
                params: {
                    username: username
                }
            }
        );
    },
    getUserSubscriptions(userId) {
        return AXIOS.get("/users/" + userId + "/subscriptions");  // returns list of subjects
    },
    addUserSubscription(userId, token, subjectId) {
        return AXIOS.put("/users/" + userId + "/subscriptions",  // adds subscription
            {
                subjectId: subjectId,
                token: token
            }
        );
    },
    removeUserSubscription(userId, token, subjectId) {
        return AXIOS.delete("/users/" + userId + "/subscriptions",
            {
                data: {
                    subjectId: subjectId,
                    token: token
                }
            })  // removes subscription of subject
    },
    getSubjectIds() {
        return AXIOS.get("/subjects");  // returns list of subject id's
    },
    getSubjects(name, ids, page, psize, sort, r) {
        let parameters = {
            q: 1,  // if this isn't null, subject objects will be returned
            name: name,  // matches to code, engname and name, can be null
            page: page,  // page number, default 0
            psize: psize,  // page size, default 20
            sort: sort,  // keyword to sort by, can be null, "engname", "name", "code" or "eap", default sort is code
            r: r  // int, if above 0 (1), response will be reversed in order
        };
        if (ids !== null) {
            parameters["ids"] = ids.toString(); // list of ids to get
        }

        return AXIOS.get(  // returns list of subjects that match the filters, can change it to better fit frontend needs
            "/subjects",
            {
                params: parameters
            }
        );
    },
    getSubject(subjectId) {
        return AXIOS.get("/subjects/" + subjectId);  // returns subject
    },
    createReview(userId, token, subjectId, review, rating) {
        return axios.post(
            '/api/subjects/' + subjectId + '/reviews',
            {
                userId: userId,
                review: review,
                rating: rating,
                token: token
            }
        );
    },
    createComment(userId, token, subjectId, comment) {
        return axios.post(
            '/api/subjects/' + subjectId + '/comments',
            {
                userId: userId,
                comment: comment,
                token: token
            }
        );

    },
    deleteComment(token, userId, commentId) {
        return AXIOS.delete("/subjects/" + userId + "/comments",
            {
                data: {
                    commentId: commentId,
                    token: token
                }
            })  // removes subscription of subject
    },
    deleteReview(token, userId, reviewId) {
        return AXIOS.delete("/subjects/" + userId + "/reviews",
            {
                data: {
                    reviewId: reviewId,
                    token: token
                }
            })  // removes subscription of subject
    }
}
