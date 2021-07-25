export function getFullName(source: any): string {
  if (!source) {
    return '';
  }
  return `${source?.firstName || ''}${
    source.middleName ? ' ' + source.middleName + ' ' : ' '
  }${source?.lastName || ''}`;
}
