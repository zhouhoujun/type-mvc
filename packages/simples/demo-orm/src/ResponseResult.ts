
export class ResponseResult {
    success: boolean;
    message?: string;
    data: any;
    total?: number;
    constructor() {

    }


    static success(data?: any, total?: number) {
        let rs = new ResponseResult();
        rs.success = true;
        rs.data = data;
        rs.total = total;
        return rs;
    }

    static failed(message: string) {
        let rs = new ResponseResult();
        rs.success = false;
        rs.message = message;
        return rs;
    }
}
