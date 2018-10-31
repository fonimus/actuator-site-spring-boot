import {expect} from 'chai';
import {shallowMount} from '@vue/test-utils';
import ButtonFilter from '@/components/ButtonFilter.vue';

describe('ButtonFilter.vue', () => {
    it('renders name', () => {
        const name = 'aName';
        const wrapper = shallowMount(ButtonFilter, {
            propsData: {name},
        });
        expect(wrapper.text()).to.include(name);
    });
});
