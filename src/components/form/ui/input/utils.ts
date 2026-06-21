import { DEV_AUTOCOMPLETE_BY_TYPE } from './constants';

type InputType = React.HTMLInputTypeAttribute;

interface GetAutocompleteOptions {
  type?: InputType;
  autoComplete?: string;
  disableAutocomplete?: boolean;
}

function isSupportedInputType(
  type: string,
): type is keyof typeof DEV_AUTOCOMPLETE_BY_TYPE {
  return type in DEV_AUTOCOMPLETE_BY_TYPE;
}

export function getInputAutoComplete({
  type = 'text',
  autoComplete,
  // disableAutocomplete = import.meta.env.DEV,
  disableAutocomplete = import.meta.env.PROD,
  //   disableAutocomplete = false,
}: GetAutocompleteOptions): string | undefined {
  // Explicit prop always wins
  if (autoComplete !== undefined) {
    return autoComplete;
  }

  // Browser default (means "on")
  if (!disableAutocomplete) {
    return undefined;
  }

  if (isSupportedInputType(type)) {
    return DEV_AUTOCOMPLETE_BY_TYPE[type];
  }

  return 'off';
}
