# NavigationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllNavigations**](#getallnavigations) | **GET** /api/navigations/all | |
|[**getNavigationsByType**](#getnavigationsbytype) | **GET** /api/navigations/by-type | |
|[**getUserNavigations**](#getusernavigations) | **GET** /api/navigations/user | |

# **getAllNavigations**
> ResponseListNavigationDto getAllNavigations()


### Example

```typescript
import {
    NavigationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NavigationControllerApi(configuration);

const { status, data } = await apiInstance.getAllNavigations();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseListNavigationDto**

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

# **getNavigationsByType**
> ResponseListNavigationDto getNavigationsByType()


### Example

```typescript
import {
    NavigationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NavigationControllerApi(configuration);

let userType: string; // (default to undefined)
let associatedId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getNavigationsByType(
    userType,
    associatedId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userType** | [**string**] |  | defaults to undefined|
| **associatedId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ResponseListNavigationDto**

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

# **getUserNavigations**
> ResponseListNavigationDto getUserNavigations()


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

**ResponseListNavigationDto**

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

