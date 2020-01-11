<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

	<div class="jumbotron">
		<div class="container">
			<div class="row">
				<div class="col">

					<div class="title">
						<b-badge variant="secondary">Browse users</b-badge>
					</div>

					<b-container fluid>
						<!-- User Interface controls -->
						<b-row>

							<b-col class="my-1" lg="6">
								<b-form-group
												class="mb-0"
												label="Filter"
												label-align-sm="right"
												label-cols-sm="3"
												label-for="filterInput"
												label-size="sm"
								>
									<b-input-group size="sm">
										<b-form-input
														id="filterInput"
														placeholder="Search by name or ID"
														type="search"
														v-model="filter"
										></b-form-input>
									</b-input-group>
								</b-form-group>
							</b-col>

							<b-col class="my-1" lg="6">
								<b-form-group
												class="mb-0"
												label=""
												label-align-sm="right"
												label-cols-sm="3"
												label-size="sm">
								</b-form-group>
							</b-col>

							<b-col class="my-1" lg="6">
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

						<b-btn :style='{width:30+"%"}' :class='["m-1"]' @click="searchUsers()">Search</b-btn>

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
										:filter-included-fields="['username']"
										:filter="filter"
										:sort-by.sync="sortBy"
										:sort-desc.sync="sortDesc"
										:sort-direction="sortDirection"
										:sort-compare="sortCompare"
										show-empty
										small
										stacked="md"
						>
							<template v-slot:cell(comments)="row">
								{{ row.item.comments.length }}
							</template>
							<template v-slot:cell(reviews)="row">
								{{ row.item.reviews.length }}
							</template>
							<template v-slot:cell(subjectIds)="row">
								{{ row.item.subjectIds.length }}
							</template>


							<template v-slot:cell(actions)="row">
								<b-button @click="info(row.item, row.index, $event.target)" class="mr-1" size="sm">
									Info modal
								</b-button>
								<b-button @click="row.toggleDetails" class="mr-1" size="sm">
									{{ row.detailsShowing ? 'Hide' : 'Show' }} Details
								</b-button>
								<b-button v-if="row.item.role !== 'ADMIN'" @click="deleteUser(row.item)" class="mr-1" size="sm">
									Delete User
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
		</div>
	</div>
</template>

<!--<script src="https://unpkg.com/vue"></script>-->
<script>
	import Vue from 'vue';
	import api from '../components/backend-api';
	import Buefy from 'buefy';
	import 'buefy/dist/buefy.css'

	Vue.use(Buefy);

	export default {
		data() {
			return {
				items: [],
				fields: [
					{key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
					{key: 'role', label: 'Role', sortable: true},
					{key: 'username', label: 'Username', sortable: true, class: 'text-center'},
					{key: 'comments', label: 'Comments', sortable: true},
					{key: 'reviews', label: 'Reviews', sortable: true},
					{key: 'subjectIds', label: 'Subscriptions', sortable: true},
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
		methods: {
			info(item, index, button) {
				this.infoModal.title = `Row index: ${index}`;
				this.infoModal.content = JSON.stringify(item, null, 2);
				this.$root.$emit('bv::show::modal', this.infoModal.id, button)
			},
			resetInfoModal() {
				this.infoModal.title = '';
				this.infoModal.content = ''
			},
			deleteUser(item) {

				console.log("Deleting user: " + item.id);
				api.deleteUser(item.id, this.$store.state.token)
						.then(response => {
							console.log("Response: '" + response.data + "' with Statuscode " + response.status);
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});

				this.searchUsers();

			},
			sortCompare(aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
				let a = aRow[key]; // or use Lodash `_.get()`
				let b = bRow[key];
				if (
						(typeof a === 'number' && typeof b === 'number') ||
						(a instanceof Date && b instanceof Date) ||
						(typeof a === 'string' && typeof b === 'string')
				) {
					// If both compared fields are native numbers or both are native dates
					return a < b ? -1 : a > b ? 1 : 0
				} else if (Array.isArray(a) && Array.isArray(b)) {
					return a.length < b.length ? -1 : a.length > b.length ? 1 : 0
				} else {
					// Otherwise stringify the field data and use String.prototype.localeCompare
					return toString(a).localeCompare(toString(b), compareLocale, compareOptions)
				}
			},

			// Helper function to stringify the values of an Object
			toString(value) {
				if (value === null || typeof value === 'undefined') {
					return ''
				} else if (value instanceof Object) {
					return Object.keys(value)
							.sort()
							.map(key => toString(value[key]))
							.join(' ')
				} else {
					return String(value)
				}
			},
			// onFiltered(filteredItems) {
			// 	// Trigger pagination to update the number of buttons/pages due to filtering
			// 	this.totalRows = filteredItems.length;
			// 	this.currentPage = 1
			// },
			getSubject(subjectId) {
				console.log("Getting subject: " + subjectId);
				api.getSubject(subjectId).then(response => {
							console.log("Response: '" + response.data + "' with Statuscode " + response.status);
							return response.data;
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});
			},
			searchUsers() {
				api.getUsers()
						.then(response => {
							if (response.status === 200) {
								// response.data.forEach(item => item["subscribed"] = subSet.has(item.id));
								this.items = response.data;
							}
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});


				// let sortByTemp = this.sortBy === "courseName" ? "name" : this.sortBy;
				// let r = this.sortDesc ? 1 : 0;
				// if (this.filterOn.length) {
				//     api.getSubjects(this.filter, subs, 0, 200, sortByTemp, r)
				//         .then(response => {
				//             if (response.status === 200) {
				//                 response.data.forEach(item => item["subscribed"] = true);
				//                 this.items = response.data;
				//             }
				//         })
				//         .catch(error => {
				//             console.log("Error: " + error);
				//             this.errors = error;
				//         });
				// } else {
				//     let subSet = new Set(subs);
				//     api.getSubjects(this.filter, null, 0, 200, sortByTemp, r)
				//         .then(response => {
				//             if (response.status === 200) {
				//                 response.data.forEach(item => item["subscribed"] = subSet.has(item.id));
				//                 this.items = response.data;
				//             }
				//         })
				//         .catch(error => {
				//             console.log("Error: " + error);
				//             this.errors = error;
				//         });
				// }
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../node_modules/bulma/sass/utilities/all";
	@import "../../node_modules/bulma";
	@import "../../node_modules/buefy/src/scss/buefy";

	table {
		color: var(--text-background)
	}
</style>
