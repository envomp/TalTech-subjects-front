<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="jumbotron">

		<div class="row">
			<div class="column">
				<h1>{{ subject.code }} - {{subject.courseName}}</h1>
				<h3>EAP: {{subject.eap}}</h3>
				<h3>Semesters: {{subject.semesters}}</h3>
			</div>
		</div>

		<div class="row">
			<div class="column">
				<b-container fluid>
					<!-- User Interface controls -->
					<b-row>

						<!--<b-col class="my-1" lg="10">-->
							<!--<b-form-group-->
											<!--class="mb-0"-->
											<!--label="Filter"-->
											<!--label-align-sm="right"-->
											<!--label-cols-sm="3"-->
											<!--label-for="filterInput"-->
											<!--label-size="sm"-->
							<!--&gt;-->
								<!--<b-input-group size="sm">-->
									<!--<b-form-input-->
													<!--id="filterInput"-->
													<!--placeholder="Search by name or ID"-->
													<!--type="search"-->
													<!--v-model="filter"-->
									<!--&gt;</b-form-input>-->
								<!--</b-input-group>-->
							<!--</b-form-group>-->
						<!--</b-col>-->

						<b-col class="my-1" lg="10">
							<b-form-group
											class="mb-0"
											label=""
											label-align-sm="right"
											label-cols-sm="3"
											label-size="sm">
							</b-form-group>
						</b-col>

						<b-col class="my-1" lg="10">
							<b-form-group
											class="mb-0"
											label="Per page"
											label-align-sm="right"
											label-cols-sm="3"
											label-for="perPageSelect"
											label-size="sm"
							>
								<b-form-select
												:options="pageOptions"
												id="perPageSelect"
												size="sm"
												v-model="perPage"
								></b-form-select>
							</b-form-group>
						</b-col>

					</b-row>

					<b-btn :style='{width:30+"%"}' :class='["m-1"]' @click="getSubject">Search</b-btn>

					<b-pagination
									:per-page="perPage"
									:total-rows="totalRows"
									align="fill"
									class="my-1"
									size="sm"
									v-model="currentPage"
					></b-pagination>
					<!-- Main table element -->
					<b-table
									:current-page="currentPage"
									:fields="fields"
									:items="items"
									:per-page="perPage"
									:sort-by.sync="sortBy"
									:sort-desc.sync="sortDesc"
									:sort-direction="sortDirection"
									show-empty
									small
									stacked="md"
					>
						<template v-slot:cell(time)="row">
							{{ new Date(row.item.time).toLocaleString("sv-SE") }}
						</template>

						<template v-slot:cell(actions)="row">
							<b-button @click="info(row.item, row.index, $event.target)" class="mr-1" size="sm">
								Info modal
							</b-button>
							<b-button @click="row.toggleDetails" class="mr-1" size="sm">
								{{ row.detailsShowing ? 'Hide' : 'Show' }} Details
							</b-button>
							<b-button v-if="$store.state.isAdmin || $store.state.userId === row.item.userId" @click="deleteThis(row.item)" class="mr-1" size="sm">
								Delete
							</b-button>
						</template>

						<template v-slot:row-details="row">
							<b-card>
								<ul>
									<li :key="key" v-for="(value, key) in row.item">{{ key }}: {{ value }}</li>
								</ul>
							</b-card>
						</template>
					</b-table>
					<b-pagination
									:per-page="perPage"
									:total-rows="totalRows"
									align="fill"
									class="my-1"
									size="sm"
									v-model="currentPage"
					></b-pagination>

					<b-modal :id="infoModal.id" :title="infoModal.title" @hide="resetInfoModal" ok-only>
						<pre>{{ infoModal.content }}</pre>
					</b-modal>
				</b-container>
			</div>
		</div>

		<div class="row">
			<div class="column">
				<h2>Add a review</h2>
				<!--            <Review :key=key :time=value.time :text=value.review :rating=value.rating-->
				<!--                    v-for="(value, key) in subject.reviews"></Review>-->
				<textarea :style="{width: 70+'%'}" v-model="reviewText"></textarea>

				<br>

				<b-badge variant="success">
					<input type="radio" id="good" value="POSITIVE" v-model="rating">
					<label for="good">Positive</label>
				</b-badge>

				<b-badge variant="danger">
					<input type="radio" id="bad" value="NEGATIVE" v-model="rating">
					<label for="bad">Negative</label>
				</b-badge>

				<br>

				<b-button @click="postReview()">Add Review</b-button>
			</div>
			<div class="column">
				<h2>Add a comment</h2>
				<!--            <Comment :key=key :time=value.time :text=value.comment v-for="(value, key) in subject.comments"></Comment>-->
				<textarea :style="{width: 70+'%'}" v-model="commentText"></textarea>
				<br>
				<b-button @click="postComment()">Add Comment</b-button>
			</div>
		</div>
	</div>
</template>

<script>
	import router from '../router'
	import api from '../components/backend-api'
	import SubjectReview from '../components/SubjectReview'
	import SubjectComment from "../components/SubjectComment";
	import SubjectRating from "../components/SubjectRating";

	export default {
		name: 'Subject',
		components: {SubjectRating, SubjectComment, SubjectReview},
		data() {
			return {
				id: 0,
				code: 0,
				courseName: "",
				eap: 0,
				semesters: "",
				reviews: [],
				comments: [],
				teachers: [],
				commentText: "",
				reviewText: "",
				rating: "",

				items: [],
				fields: [
					{key: 'type', label: 'Type', sortable: true, sortDirection: 'desc'},
					{key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
					{key: 'username', label: 'Username', sortable: true, sortDirection: 'desc'},
					{key: 'userId', label: 'User ID', sortable: true, sortDirection: 'desc'},
					{key: 'rating', label: 'Rating', sortable: true, class: 'text-center'},
					{key: 'time', label: 'Time', sortable: true},
					{key: 'content', label: 'Content', sortable: true},
					{key: 'actions', label: 'Actions'}
				],
				currentPage: 1,
				perPage: 10,
				pageOptions: [5, 10, 20],
				sortBy: '',
				sortDesc: false,
				sortDirection: 'asc',
				filter: null,
				filterOn: [],
				infoModal: {
					id: 'info-modal',
					title: '',
					content: ''
				}
			}
		},
		computed: {
			sortOptions() {
				// Create an options list from our fields
				return this.fields
						.filter(f => f.sortable)
						.map(f => {
							return {text: f.label, value: f.key}
						})
			},
			totalRows: function () {
				return this.items.length;
			}
		},
		created() {
			this.id = this.$route.query.id;
			this.subject = [];

		},
		methods: {
			deleteThis(item) {
				if (item.type === "Comment") {
					console.log("Deleting comment");
					api.deleteComment(this.$store.state.token, item.userId, item.id)
							.then(() => {
								this.items = this.items.filter(function (e) {
									return e !== item;
								});
							});
				}
				if (item.type === "Review") {
					console.log("Deleting review");
					api.deleteReview(this.$store.state.token, item.userId, item.id)
							.then(() => {
								this.items = this.items.filter(function (e) {
									return e !== item;
								});
							});
				}
				// this.getSubject();
			},
			info(item, index, button) {
				this.infoModal.title = `Row index: ${index}`;
				this.infoModal.content = JSON.stringify(item, null, 2);
				this.$root.$emit('bv::show::modal', this.infoModal.id, button)
			},
			resetInfoModal() {
				this.infoModal.title = '';
				this.infoModal.content = ''
			},
			navigate() {
				router.go(-1);
			},
			getSubject() {
				console.log("Getting subject");
				api.getSubject(this.id).then(response => {
							console.log("Response: '" + response.data + "' with Statuscode " + response.status);
							this.subject = response.data;
							console.log("Successfully got subject: " + this.subject.id);

							this.items = [];
							this.subject.comments.forEach(item => {
								item["type"] = "Comment";
								item["content"] = item["comment"];
							});
							this.subject.reviews.forEach(item => {
								item["type"] = "Review";
								item["content"] = item["review"];
							});
							this.items = this.subject.comments.concat(this.subject.reviews);

						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});
				this.$forceUpdate();
			},
			postComment() {
				if (this.commentText === "") {
					return;
				}
				console.log("Posting comment: " + this.commentText);
				console.log("Store ID is: " + this.$store.state.userId);
				api.createComment(this.$store.state.userId, this.$store.state.token, this.subject.id, this.commentText)
						.then(response => {
							console.log("Response: '" + response.data + "' with Statuscode " + response.status);
							console.log("Successfully posted comment");
							this.commentText = "";
							this.getSubject();
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});
				// this.getSubject();
				// this.$forceUpdate();
			},
			postReview() {
				if (this.reviewText === "") {
					return;
				}
				console.log("Posting review: " + this.reviewText);
				console.log("Store ID is: " + this.$store.state.userId);
				api.createReview(this.$store.state.userId, this.$store.state.token, this.subject.id, this.reviewText, this.rating)
						.then(response => {
							console.log("Response: '" + response.data + "' with Statuscode " + response.status);
							console.log("Successfully posted review");
							this.reviewText = "";
							this.rating = null;
							this.getSubject();
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});
				// this.getSubject();
				// this.$forceUpdate();
			}
		},
		mounted() {
			this.getSubject();//TODO: MAKE INFO LOAD ON MOUNT.
		}
	}
</script>

<style scoped>
	.d-inline-block {
		padding: 15px;
	}

	.rating {
		height: 7vh;
		width: auto;
		margin: 2px;
	}
</style>