# DefaultApi

All URIs are relative to _http://localhost:8080_

| Method            | HTTP request  | Description |
| ----------------- | ------------- | ----------- |
| [**test**](#test) | **GET** /test | 测试接口    |

# **test**

> ResponseString test()

返回测试字符串

### Example

```typescript
import { DefaultApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.test();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**ResponseString**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: _/_

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | OK          | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
