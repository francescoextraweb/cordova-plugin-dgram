#import "NSDataConversion.h"

@implementation NSDataConversion

#pragma mark - Bytes Conversion
- (NSString *)dataToHexString: (NSData *)data {
    NSUInteger length = data.length;
    unichar* hexChars = (unichar*)malloc(sizeof(unichar) * (length*2));
    unsigned char* bytes = (unsigned char*)data.bytes;
    for (NSUInteger i = 0; i < length; i++) {
        unichar c = bytes[i] / 16;
        if (c < 10) {
            c += '0';
        } else {
            c += 'A' - 10;
        }
        hexChars[i*2] = c;

        c = bytes[i] % 16;
        if (c < 10) {
            c += '0';
        } else {
            c += 'A' - 10;
        }
        hexChars[i*2+1] = c;
    }
    NSString* retVal = [[NSString alloc] initWithCharactersNoCopy:hexChars length:length*2 freeWhenDone:YES];
    return [retVal autorelease];
}

#pragma mark - String Conversion
- (NSData *)hexStringToData: (NSString *)string {
    string = [string lowercaseString];
    NSMutableData *data= [NSMutableData new];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    int i = 0;
    int length = string.length;
    while (i < length-1) {
        char c = [string characterAtIndex:i++];
        if (c < '0' || (c > '9' && c < 'a') || c > 'f')
            continue;
        byte_chars[0] = c;
        byte_chars[1] = [string characterAtIndex:i++];
        whole_byte = strtol(byte_chars, NULL, 16);
        [data appendBytes:&whole_byte length:1];
    }
    return data;
}

@end
