import { IBaseButton } from './BaseButton';

const base: IBaseButton = {
  onClick: () => {
    console.log('click');
  },
  loading: true,
};

export const mockBaseButtonProps = {
  base,
};
