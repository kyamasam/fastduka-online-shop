import app from '../../config/configApp';
import Cards from '../../components/cards/frame/CardsFrame.vue';
import BtnGroup from '../../components/buttons/ButtonGroup.vue';
import Button from '../../components/buttons/Buttons.vue';
import Heading from '../../components/heading/Heading';
import Dropdown from '../../components/dropdown/Dropdown';
import Popover from '../../components/popup/Popup.vue'

[
  Heading,
  Cards,
  {
    name: 'Button',
    ...Button,
  },
  {
    name: 'BtnGroup',
    ...BtnGroup,
  },
  Dropdown,
  Popover,
].map((c) => {
  app.component(`sd${c.name}`, c);
});
