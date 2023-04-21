#import <Foundation/Foundation.h>

@interface NSData (NSData_Conversion)

#pragma mark - Bytes data to hex string conversion
- (NSString *)dataToHexString;

#pragma mark - Hex string to bytes data conversion 
- (NSString *)hexStringToData;

@end