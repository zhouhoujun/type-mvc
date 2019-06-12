
/**
 * authenticate option.
 *
 * @export
 * @interface AuthenticateOption
 */
export interface AuthenticateOption {
    session?: boolean;
    successRedirect?: string;
    successReturnToOrRedirect?: string;
    failureRedirect?: string;
    assignProperty?: any;
    failureFlash?: string | { type: string, message: string };
    failureMessage?: string | boolean;
    failWithError?: boolean;
    successFlash?: string | { type: string, message: string };
    successMessage?: string | boolean;
    authInfo?: boolean;
}
