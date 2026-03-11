# NavigationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserNavigations**](#getusernavigations) | **GET** /api/navigations/user | |

# **getUserNavigations**
> ResponseListNavigationDTO getUserNavigations()


### Example

```typescript
import {
    NavigationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NavigationControllerApi(configuration);

const { status, data } = await apiInstance.getUserNavigations();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseListNavigationDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

