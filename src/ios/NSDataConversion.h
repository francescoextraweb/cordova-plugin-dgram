#import <Foundation/Foundation.h>

@interface NSDataConversion:NSObject
/* method declaration */
- (NSString *)dataToHexString: (NSData *)data;
- (NSData *)hexStringToData: (NSString *)string;
@end
