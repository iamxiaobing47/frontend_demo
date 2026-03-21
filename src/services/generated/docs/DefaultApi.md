# DefaultApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /api/config/template/{id} | テンプレート削除|
|[**create**](#create) | **POST** /api/config/template | テンプレート作成|
|[**create1**](#create1) | **POST** /api/config/region | 地域作成|
|[**create2**](#create2) | **POST** /api/config/product | 品目作成|
|[**create3**](#create3) | **POST** /api/config/country | 国家作成|
|[**createTestUser**](#createtestuser) | **POST** /api/test | 测试接口|
|[**createUser**](#createuser) | **POST** /api/users/create | 创建用户|
|[**delete1**](#delete1) | **DELETE** /api/config/region/{id} | 地域削除|
|[**delete2**](#delete2) | **DELETE** /api/config/product/{id} | 品目削除|
|[**delete3**](#delete3) | **DELETE** /api/config/country/{id} | 国家削除|
|[**deleteUser**](#deleteuser) | **DELETE** /api/users | 删除用户|
|[**getUser**](#getuser) | **GET** /api/users/{userId} | 获取用户信息|
|[**getUserNavigations**](#getusernavigations) | **GET** /api/navigations/user | 获取用户导航菜单|
|[**list**](#list) | **GET** /api/config/template | テンプレート一覧取得|
|[**list1**](#list1) | **GET** /api/config/region | 地域一覧取得|
|[**list2**](#list2) | **GET** /api/config/product | 品目一覧取得|
|[**list3**](#list3) | **GET** /api/config/country | 国家一覧取得|
|[**listByRegion**](#listbyregion) | **GET** /api/config/country/region/{regionCd} | 地域別国家取得|
|[**login**](#login) | **POST** /api/auth/login | 用户登录|
|[**logout**](#logout) | **POST** /api/auth/logout | 用户登出|
|[**pageUsers**](#pageusers) | **POST** /api/users/page | 分页查询用户列表|
|[**refreshToken**](#refreshtoken) | **POST** /api/auth/refresh | 刷新 Token|
|[**test**](#test) | **GET** /api/test | 测试接口|
|[**update**](#update) | **PUT** /api/config/template/{id} | テンプレート更新|
|[**update1**](#update1) | **PUT** /api/config/region/{id} | 地域更新|
|[**update2**](#update2) | **PUT** /api/config/product/{id} | 品目更新|
|[**update3**](#update3) | **PUT** /api/config/country/{id} | 国家更新|
|[**updateUser**](#updateuser) | **PUT** /api/users | 更新用户信息|

# **_delete**
> ResponseVoid _delete()

テンプレートを削除します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance._delete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

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

# **create**
> ResponseVoid create(applicationTemplateEntity)

新しいテンプレートを作成します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApplicationTemplateEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationTemplateEntity: ApplicationTemplateEntity; //

const { status, data } = await apiInstance.create(
    applicationTemplateEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationTemplateEntity** | **ApplicationTemplateEntity**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create1**
> ResponseVoid create1(regionEntity)

新しい地域を作成します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RegionEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let regionEntity: RegionEntity; //

const { status, data } = await apiInstance.create1(
    regionEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **regionEntity** | **RegionEntity**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create2**
> ResponseVoid create2(productEntity)

新しい品目を作成します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ProductEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let productEntity: ProductEntity; //

const { status, data } = await apiInstance.create2(
    productEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productEntity** | **ProductEntity**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create3**
> ResponseVoid create3(countryEntity)

新しい国家を作成します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CountryEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let countryEntity: CountryEntity; //

const { status, data } = await apiInstance.create3(
    countryEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **countryEntity** | **CountryEntity**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createTestUser**
> ResponseString createTestUser()

创建测试用户

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let email: string; // (default to undefined)
let password: string; // (default to undefined)

const { status, data } = await apiInstance.createTestUser(
    email,
    password
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|
| **password** | [**string**] |  | defaults to undefined|


### Return type

**ResponseString**

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

# **createUser**
> ResponseVoid createUser(createUserRequest)

创建新用户

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createUserRequest: CreateUserRequest; //

const { status, data } = await apiInstance.createUser(
    createUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserRequest** | **CreateUserRequest**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete1**
> ResponseVoid delete1()

地域を削除します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

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

# **delete2**
> ResponseVoid delete2()

品目を削除します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete2(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

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

# **delete3**
> ResponseVoid delete3()

国家を削除します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

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

# **deleteUser**
> ResponseVoid deleteUser(deleteUserRequest)

删除当前用户

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DeleteUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deleteUserRequest: DeleteUserRequest; //

const { status, data } = await apiInstance.deleteUser(
    deleteUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteUserRequest** | **DeleteUserRequest**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUser**
> ResponseUserInfo getUser()

根据用户 ID 获取用户信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**ResponseUserInfo**

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
> ResponseListNavigationDTO getUserNavigations()

根据当前登录用户返回对应的导航菜单

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

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

# **list**
> ResponseListApplicationTemplateEntity list()

条件を指定してテンプレートの一覧を取得します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let regionCd: number; // (optional) (default to undefined)
let countryCd: number; // (optional) (default to undefined)
let productCd: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.list(
    regionCd,
    countryCd,
    productCd
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **regionCd** | [**number**] |  | (optional) defaults to undefined|
| **countryCd** | [**number**] |  | (optional) defaults to undefined|
| **productCd** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ResponseListApplicationTemplateEntity**

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

# **list1**
> ResponseListRegionEntity list1()

すべての地域を取得します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.list1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseListRegionEntity**

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

# **list2**
> ResponseListProductEntity list2()

すべての品目を取得します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.list2();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseListProductEntity**

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

# **list3**
> ResponseListCountryEntity list3()

すべての国家を取得します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.list3();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseListCountryEntity**

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

# **listByRegion**
> ResponseListCountryEntity listByRegion()

地域コードを指定して国家の一覧を取得します

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let regionCd: number; // (default to undefined)

const { status, data } = await apiInstance.listByRegion(
    regionCd
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **regionCd** | [**number**] |  | defaults to undefined|


### Return type

**ResponseListCountryEntity**

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

# **login**
> ResponseLoginResponse login(loginRequest)

使用邮箱和密码登录

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**ResponseLoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> ResponseVoid logout()

清除认证信息并删除 refresh token

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.logout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseVoid**

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

# **pageUsers**
> ResponseIPageUserInfo pageUsers(pageUserQueryRequest)

根据分页参数和筛选条件查询用户列表

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PageUserQueryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pageUserQueryRequest: PageUserQueryRequest; //

const { status, data } = await apiInstance.pageUsers(
    pageUserQueryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageUserQueryRequest** | **PageUserQueryRequest**|  | |


### Return type

**ResponseIPageUserInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshToken**
> ResponseLoginResponse refreshToken()

使用 refresh token 获取新的 access token

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.refreshToken();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ResponseLoginResponse**

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

# **test**
> ResponseString test()

返回测试字符串

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update**
> ResponseVoid update(applicationTemplateEntity)

テンプレート情報を更新します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApplicationTemplateEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let applicationTemplateEntity: ApplicationTemplateEntity; //

const { status, data } = await apiInstance.update(
    id,
    applicationTemplateEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationTemplateEntity** | **ApplicationTemplateEntity**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update1**
> ResponseVoid update1(regionEntity)

地域情報を更新します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RegionEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let regionEntity: RegionEntity; //

const { status, data } = await apiInstance.update1(
    id,
    regionEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **regionEntity** | **RegionEntity**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update2**
> ResponseVoid update2(productEntity)

品目情報を更新します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ProductEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let productEntity: ProductEntity; //

const { status, data } = await apiInstance.update2(
    id,
    productEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productEntity** | **ProductEntity**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update3**
> ResponseVoid update3(countryEntity)

国家情報を更新します

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CountryEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let countryEntity: CountryEntity; //

const { status, data } = await apiInstance.update3(
    id,
    countryEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **countryEntity** | **CountryEntity**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUser**
> ResponseVoid updateUser(updateUserRequest)

更新当前用户信息

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let updateUserRequest: UpdateUserRequest; //

const { status, data } = await apiInstance.updateUser(
    updateUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserRequest** | **UpdateUserRequest**|  | |


### Return type

**ResponseVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

