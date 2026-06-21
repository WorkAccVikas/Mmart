import { Input } from '@/components/ui/input';
import { getInputAutoComplete } from './utils';

export function AppInput({
  type,
  autoComplete,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      type={type}
      autoComplete={getInputAutoComplete({
        type,
        autoComplete,
      })}
    />
  );
}
