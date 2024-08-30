
export const asyncHandler = ( asyncFunction ) => {
    return (req, res, next) => {
        Promise.resolve(asyncFunction(req, res, next))
        .then(() => next()) 
        .catch(err => next(err)) ;
    }
}