import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

class HttpClient {
    private readonly instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    private _initializeRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig<any>) => {
                return config;
            },
            this._handleError,
        );
    };

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    private _handleError = (error: any) => {
        if (error.response) {
            console.log('HTTP Error:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log('Error MSG : ', error.response.data.message);
        throw new Error(error.response.data.message);
    };

    get<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.instance.get<T, R>(url, config);
    }

    post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.instance.post<T, R>(url, data, config);
    }

    delete<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.instance.delete<T, R>(url, config);
    }

    put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        return this.instance.put<T, R>(url, data, config);
    }

    postAsForm<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        const formConfig = {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        };

        return this.instance.post<T, R>(url, data, formConfig);
    }
}

export default HttpClient;
