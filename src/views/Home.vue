<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

	<div class="jumbotron">
		<div class="container">
			<div class="row">
				<div class="col">

					<div class="title">
						<b-badge variant="secondary">Browse subjects</b-badge>
					</div>
					<b-badge v-if="totalRows === 200" variant="warning" class="mb-2">200 results reached, please refine your search</b-badge>


					<b-container fluid>
						<!-- User Interface controls -->
						<b-row>
							<b-col class="my-1" lg="6">
								<b-form-group
												class="mb-0"
												label="Order by"
												label-align-sm="right"
												label-cols-sm="3"
												label-for="sortBySelect"
												label-size="sm"
								>
									<b-input-group size="sm">
										<b-form-select class="w-75" id="sortBySelect"
																	 v-model="sortBy">
											<option value="code">Code</option>
											<option value="courseName">Name</option>
											<option value="eap">EAP</option>
										</b-form-select>
										<b-form-select :disabled="!sortBy" class="w-25" size="sm" v-model="sortDesc">
											<option :value="false">Asc</option>
											<option :value="true">Desc</option>
										</b-form-select>
									</b-input-group>
								</b-form-group>
							</b-col>

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
														placeholder="Search by name or code"
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
									<b-form-checkbox-group class="mt-1" v-model="filterOn">
										<b-form-checkbox value="subscribed">Subscribed only</b-form-checkbox>
									</b-form-checkbox-group>
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

						<b-btn :style='{width:30+"%"}' :class='["m-1"]' @click="searchSubjects()">Search</b-btn>

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
							<template v-slot:cell(subscribed)="row">
								<the-subscription-button
												:sub-status="row.item.subscribed"
												:subject-id="row.item.id"
												@sub-toggle="row.item.subscribed = !row.item.subscribed"
								></the-subscription-button>
							</template>

							<template v-slot:cell(actions)="row">
								<b-button @click="info(row.item, row.index, $event.target)" class="mr-1" size="sm">
									Info modal
								</b-button>
								<b-button @click="row.toggleDetails" class="mr-1" size="sm">
									{{ row.detailsShowing ? 'Hide' : 'Show' }} Details
								</b-button>
								<router-link :to="{ path: '/subject', query: { id: row.item.id }}">
									<b-button size="sm">
										Feedback
									</b-button>
								</router-link>
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

						<!-- Info modal -->
						<b-modal :id="infoModal.id" :title="infoModal.title" @hide="resetInfoModal" ok-only>
							<pre>{{ infoModal.content }}</pre>
						</b-modal>
					</b-container>
					<!--
					<section>
							<b-tabs>
									<b-tab-item label="Pictures" icon="photo_library"></b-tab-item>
									<b-tab-item label="Music" icon="library_music"></b-tab-item>
									<b-tab-item label="Videos" icon="video_library"></b-tab-item>
							</b-tabs>
					</section>
					<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
					-->
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
	import 'buefy/dist/buefy.css';
	import TheSubscriptionButton from '../components/TheSubscriptionButton'

	Vue.use(Buefy);

	export default {
		components: {TheSubscriptionButton},
		data() {
			return {
				items: [],
				fields: [
					{key: 'code', label: 'Course code', sortable: true, sortDirection: 'desc'},
					{key: 'courseName', label: 'Course name', sortable: true, class: 'text-center'},
					{key: 'eap', label: 'EAP', sortable: true},
					{
						key: 'subscribed',
						label: 'Subscribed',
						formatter: (value, key, item) => {
							return value ? 'Yes' : 'No'
						},
						sortable: false,
						sortByFormatted: true,
						filterByFormatted: true
					},
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
			searchSubjects() {
				let subs = [];
				api.getUserSubscriptions(this.$store.state.userId)
						.then(response => {
							if (response.status === 200) {
								subs = response.data;
								let sortByTemp = this.sortBy === "courseName" ? "name" : this.sortBy;
								let r = this.sortDesc ? 1 : 0;

								if (this.filterOn.length) {
									api.getSubjects(this.filter, subs, 0, 200, sortByTemp, r)
											.then(subResponse => {
												if (subResponse.status === 200) {
													subResponse.data.forEach(item => item["subscribed"] = true);
													this.items = subResponse.data;
												}
											})
											.catch(subError => {
												console.log("Error: " + subError);
												this.errors = subError;
											});
								} else {
									api.getSubjects(this.filter, null, 0, 200, sortByTemp, r)
											.then(subResponse => {
												if (subResponse.status === 200) {
													let subSet = new Set(subs);
													subResponse.data.forEach(item => item["subscribed"] = subSet.has(item.id));
													this.items = subResponse.data;
												}
											})
											.catch(subError => {
												console.log("Error: " + subError);
												this.errors = subError;
											});
								}
							}
						})
						.catch(error => {
							console.log("Error: " + error);
							this.errors = error;
						});
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
