import { parseGenerator } from '../../';

describe('selectFormattedGenerator', function () {
  describe('#parseGenerator', function () {
    it('should parse User-Agent strings correctly', () => {
      const withVersion = parseGenerator('Adobe_Photoshop/1.0.0 c2pa-rs/0.5.0');
      expect(withVersion).toEqual('Adobe Photoshop 1.0.0');

      const withShortVersion = parseGenerator(
        'Adobe_Photoshop/1.2 c2pa-rs/0.5.0',
      );
      expect(withShortVersion).toEqual('Adobe Photoshop 1.2');

      const withParens = parseGenerator(
        'Adobe_Photoshop/1.0.0 (plugin version 2.3.1) c2pa-rs/0.5.0 (openssl version 0.9.8)',
      );
      expect(withParens).toEqual('Adobe Photoshop 1.0.0');

      const withoutVersion = parseGenerator('Adobe_Photoshop c2pa-rs/0.4.2');
      expect(withoutVersion).toEqual('Adobe Photoshop');
    });

    it('should parse old (XMP Agent) strings correctly', () => {
      const parsed = parseGenerator(
        'Adobe Photoshop 23.3.1 (build 20220419.r.426 4d24a4c; mac; ContentCredentials 37f01a3)',
      );
      expect(parsed).toEqual('Adobe Photoshop 23.3.1');
    });

    it('should parse invalid strings as User-Agents', () => {
      const parsed = parseGenerator('C2PA Testing');
      expect(parsed).toEqual('C2PA');
    });
  });
});
