<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Tax Rate Management</h2>

            <div class="flex justify-end mb-4">
                <button @click="openModal()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Tax Rate
                </button>
            </div>

            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Default
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Active
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                            <span class="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="taxRate in taxRates" :key="taxRate.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ taxRate.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ taxRate.display_rate }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span :class="[taxRate.is_default ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                {{ taxRate.is_default ? 'Yes' : 'No' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             <span :class="[taxRate.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                {{ taxRate.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button @click="openModal(taxRate)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                            <button @click="deleteTaxRate(taxRate)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
                <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">{{-1 !== editingTaxRateId ? 'Edit' : 'Add' }} Tax Rate</h3>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" v-model="form.name" id="name" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div>
                                <label for="rate" class="block text-sm font-medium text-gray-700">Rate (%)</label>
                                <input type="number" v-model="form.rate" id="rate" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea v-model="form.description" id="description" rows="3" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                            </div>
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="is_default" v-model="form.is_default" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="is_default" class="font-medium text-gray-700">Is Default?</label>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="is_active" v-model="form.is_active" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="is_active" class="font-medium text-gray-700">Is Active?</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="saveTaxRate" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                            Save
                        </button>
                        <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaxSettings',
    data() {
        return {
            taxRates: [],
            showModal: false,
            editingTaxRateId: null,
            form: {
                name: '',
                rate: 0,
                description: '',
                is_default: false,
                is_active: true,
            },
        };
    },
    async mounted() {
        await this.fetchTaxRates();
    },
    methods: {
        async fetchTaxRates() {
            try {
                const response = await this.$store.dispatch('fetchList', { url: 'tax-rate/' });
                this.taxRates = response.data.results;
            } catch (error) {
                console.error('Error fetching tax rates:', error);
                this.$message.error('Failed to load tax rates.');
            }
        },
        openModal(taxRate = null) {
            if (taxRate) {
                this.editingTaxRateId = taxRate.id;
                this.form = { ...taxRate };
            } else {
                this.editingTaxRateId = null;
                this.form = { name: '', rate: 0, description: '', is_default: false, is_active: true };
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.editingTaxRateId = null;
        },
        async saveTaxRate() {
            try {
                if (this.editingTaxRateId !== null) {
                    await this.$store.dispatch('patchData', { url: 'tax-rate', id: this.editingTaxRateId, data: this.form });
                    this.$message.success('Tax rate updated successfully!');
                } else {
                    await this.$store.dispatch('postData', { url: 'tax-rate', data: this.form });
                    this.$message.success('Tax rate created successfully!');
                }
                await this.fetchTaxRates();
                this.closeModal();
            } catch (error) {
                console.error('Error saving tax rate:', error);
                this.$message.error('Failed to save tax rate.');
            }
        },
        async deleteTaxRate(taxRate) {
            if (confirm(`Are you sure you want to delete ${taxRate.name}?`)) {
                try {
                    await this.$store.dispatch('deleteData', { url: 'tax-rate', id: taxRate.id });
                    this.$message.success('Tax rate deleted successfully!');
                    await this.fetchTaxRates();
                } catch (error) {
                    console.error('Error deleting tax rate:', error);
                    this.$message.error('Failed to delete tax rate.');
                }
            }
        },
    },
};
</script>
