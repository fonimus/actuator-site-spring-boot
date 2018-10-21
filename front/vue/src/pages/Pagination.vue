<template>
    <div v-if="display && ready" class="row align-items-center no-gutters">
        <div class="col">
            <ul class="pagination">
                <li class="page-item pointer" v-for="n in limits" :class="{active: limit === n}">
                    <a class="page-link" @click="setLimit(n)">{{n}}</a>
                </li>
            </ul>
        </div>
        <div class="col">
            <p class="d-none d-lg-block">{{display}}</p>
            <p class="d-lg-none text-center">{{displaySmall}}</p>
        </div>
        <div class="col d-flex flex-row-reverse">
            <nav aria-label="pagination">
                <ul class="pagination">
                    <li class="page-item" :class="{disabled: page <= 1}" @click="page > 1 && setPage('previous')">
                        <a class="page-link pointer" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    <li class="page-item" v-if="page - maxPages >= 1"
                        @click="page - maxPages >= 1 && setPage(page - maxPages)">
                        <a class="page-link pointer" aria-label="Next">
                            <span aria-hidden="true">...</span>
                            <span class="sr-only">...</span>
                        </a>
                    </li>
                    <li class="page-item pointer d-none d-lg-block" v-for="n in pages" :class="{active: page === n}">
                        <a class="page-link" @click="setPage(n)">{{n}}</a>
                    </li>
                    <li class="page-item active d-lg-none">
                        <a class="page-link">{{page}}</a>
                    </li>
                    <li class="page-item" v-if="page + maxPages < max"
                        @click="page + maxPages < max && setPage(page + maxPages)">
                        <a class="page-link pointer" aria-label="Next">
                            <span aria-hidden="true">...</span>
                            <span class="sr-only">...</span>
                        </a>
                    </li>
                    <li class="page-item" :class="{disabled: page >= max}" @click="page < max && setPage('next')">
                        <a class="page-link pointer" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
    function range(start, count) {
        return Array.apply(0, Array(count)).map(function (element, index) {
            return index + start
        })
    }

    function displayCount(page, limit, max, count, text) {
        let from = ((page - 1) * limit) + 1;
        let to = page === max ? count : from + limit - 1;
        let parts = text.split('|');
        let i = Math.min(count === 1 ? 2 : max === 1 ? 1 : 0, parts.length - 1);
        return parts[i].replace('@count@', count).replace('@from@', from).replace('@to@', to);
    }

    export default {
        name: 'Pagination',
        props: {
            display: {
                type: Boolean,
                required: false,
                default: true
            },
            table: {
                required: true
            },
            maxPages: {
                type: Number,
                required: false,
                default: 10
            },
            countText: {
                type: String,
                required: false
            },
            smallCountText: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                ready: false
            }
        },
        beforeUpdate() {
            this.updateTranslations();
        },
        mounted() {
            this.updateTranslations();
            this.ready = true
        },
        computed: {
            page() {
                return this.table.Page
            },
            max() {
                return Math.ceil(this.table.count / this.table.limit)
            },
            limit() {
                return this.table.limit
            },
            limits() {
                return this.table.opts.perPageValues
            },
            pages() {
                if (this.max > this.maxPages) {
                    return range(this.start, this.pagesInCurrentChunk)
                } else {
                    return this.max
                }
            },
            totalChunks() {
                return Math.ceil(this.max / this.maxPages)
            },
            currentChunk() {
                return Math.ceil(this.page / this.maxPages)
            },
            start() {
                return ((this.currentChunk - 1) * this.maxPages) + 1
            },
            pagesInCurrentChunk() {
                return this.start + this.maxPages <= this.max ? this.maxPages : this.max - this.start + 1
            },
            display() {
                if (!this.countText) {
                    return '';
                }
                return displayCount(this.page, this.limit, this.max, this.table.count, this.countText)
            },
            displaySmall() {
                if (!this.smallCountText) {
                    return '';
                }
                return displayCount(this.page, this.limit, this.max, this.table.count, this.smallCountText)
            }
        },
        methods: {
            updateTranslations() {
                if (!this.countText) {
                    this.countText = this.$t('pagination.count.text');
                }
                if (!this.smallCountText) {
                    this.smallCountText = this.$t('pagination.small-count.text');
                }
            },
            setPage(page) {
                let newPage = page;
                if (page === 'previous') {
                    newPage = this.table.Page - 1;
                } else if (page === 'next') {
                    newPage = this.table.Page + 1;
                }
                this.table.setPage(newPage);
            },
            setLimit(limit) {
                this.table.setLimit(limit);
            }
        }
    }
</script>
