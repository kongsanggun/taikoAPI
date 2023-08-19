export default function replaceAll(param: string, source: string): string {
  return param.replace(`/${source}/gi`, '');
}
