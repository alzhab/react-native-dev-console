import {useDevConsoleAdapter} from '../Console/adapter';
import {IDevConsoleContainerProps} from '../Console';

export interface IMenuProps {
  close: () => void;
  diable: () => void;
  isOpen: boolean;
  adapter: ReturnType<typeof useDevConsoleAdapter>;
  CustomTab: IDevConsoleContainerProps['CustomTab'];
}
