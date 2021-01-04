import _ from 'lodash'
import React, {useEffect, useState} from 'react'

export default function withHOC(Talk, hocInfos, props) {
    return () => {

        const makeState = (infos) => {

            const state = {
                beforeReady: null,
            }

            infos.forEach( ({name, loader, before, success, error}) => {

                const resolvers = { confirm: null, deny: null }
                const confirm = new Promise((res, rej) => resolvers.confirm = res)
                const deny    = new Promise((res, rej) => resolvers.deny = res)

                state[name] = {
                    data: null,
                    errors: null,
                    loader: {
                        component: () => null,
                        props: {},
                        show: false,
                    },
                    success: {
                        component: () => null,
                        props: {},
                        show: false,
                    },
                    error: {
                        component: () => null,
                        props: {},
                        show: false,
                    },
                    before: {
                        component: () => null,
                        props: {},
                        show: false,
                        resolvers,
                        confirm,
                        deny,
                        confirmFn: () => null,
                        denyFn: () => null,
                    }
                }
            })
            return state
        }

        const INIT_STATE = makeState(hocInfos)

        const [state, setState] = useState(INIT_STATE)

        const setComponentProps = (name, props, component) => {
            setState( prev => {
                const newProps = { props: () => props}
                const newState = {
                    ...prev,
                    [name]: {
                        ...prev[name],
                        [component]: {
                            ...prev[name][component],
                            props: {
                                ...prev[name][component].props,
                                ...props
                            }
                        }
                    }
                }
                return newState
            })
        }

        const setSuccessProps = (name, p) => setComponentProps(name, p, 'success')

        const setErrorProps = (name, p) => setComponentProps(name, p, 'error')

        const setLoaderProps = (name, p) => setComponentProps(name, p, 'loader')

        const setBeforeProps = (name, p) => setComponentProps(name, p, 'before')

        const shouldShowComponent = (component) => {
            if(component.render === null || component.render === undefined ){
                return true
            }
            return component.render
        }

        const performAction = async ({name, loader, before, action, success, error}, data) => {
            
            if(!_.isEmpty(loader)){
                setState( prev => ({ 
                    ...prev,
                    [name]: {
                        ...prev[name], 
                        loader: {
                            ...prev[name].loader,
                            component: loader.component,
                            props: { ...loader.props( props => setLoaderProps(name, props) , prev[name].data, prev[name].errors) },
                            show: shouldShowComponent(loader)
                        } 
                    } 
                }))
            }

            try{
                const response = await action(data)

                if(!_.isEmpty(loader) || !_.isEmpty(success)){
                    setState( prev => {
                        return { 
                            ...prev,
                            [name]: {
                                ...prev[name],
                                data: response,
                                loader: {
                                    ...prev[name].loader, 
                                    props: {}
                                }, 
                                success: {
                                    ...prev[name].success,
                                    show: shouldShowComponent(success),
                                    component: success.component,
                                    props: { ...success.props( props => setSuccessProps(name, props), response, prev[name].errors) },
                                }
                            }
                        } 
                    })
                }
            }
            catch(err){
                console.log('err is', err)
                if(!_.isEmpty(loader) || !_.isEmpty(error)){
                    setState( prev => {
                        return { 
                            ...prev,
                            [name]: {
                                ...prev[name],
                                errors: err,
                                loader: {
                                    ...prev[name].loader, 
                                    props: {}
                                }, 
                                error: {
                                    ...prev[name].error,
                                    show: shouldShowComponent(error),
                                    component: error.component,
                                    props: { ...error.props( props => setErrorProps(name, props), prev[name].data, err) },
                                }
                            }
                        } 
                    })
                }
            }

        }

        const initBeforeState = ({name, before, data}) => {

            const resolvers = { confirm: null, deny: null }
            const confirm = new Promise((res, rej) => resolvers.confirm = res)
            const deny    = new Promise((res, rej) => resolvers.deny = res)

            const confirmFn = () => {
                setState(prev => {
                    prev[name].before.resolvers.confirm('Action Confirmed!')
                    return {
                        ...prev,
                        [name]: {
                            ...prev[name],
                            before: {
                                ...prev[name].before,
                                show: false
                            }
                        }
                    }
                })
            }
            const denyFn = () => {
                setState(prev => {
                    prev[name].before.resolvers.deny('Action Denied!')
                    return{
                        ...prev,
                        [name]: {
                            ...prev[name],
                            before: {
                                ...prev[name].before,
                                show: false
                            }
                        }
                    }
                })
            }
            setState( prev => {
                return {
                    ...prev,
                    beforeReady: {
                        [name]: {
                            ready: true,
                            data
                        }
                    },
                    [name]: {
                        ...prev[name],
                        before: {
                            ...prev[name].before,
                            component: before.component,
                            props: {
                                ...before.props(props => setBeforeProps(name, props), prev[name].data, prev[name].errors),
                                confirmFn,
                                denyFn
                            },
                            resolvers,
                            confirm,
                            deny,
                            confirmFn,
                            denyFn,
                            show: false
                        },
                    }
                }
            })
        }

        const performBeforeAction = async ({name, before}) => {
            setState( prev => {
                return {
                    ...prev,                  
                    [name]: {
                        ...prev[name],
                        before: {
                            ...prev[name].before, 
                            show: shouldShowComponent(before)
                        }
                    }
                }
            })
        }

        const fnInfo = {}
        hocInfos.forEach( ({name, loader, before, action, success, error}) => {
            fnInfo[name] = async (data) => {
                if(_.isEmpty(before)){
                    performAction({name, loader, before, action, success, error}, data)
                }
                else {
                    initBeforeState({name, before, data})
                }
            }
        })
        const data = {}
        const errors = {}
        const components = {}

        Object.keys(state).filter( k => k !== 'beforeReady').forEach( n => {
            data[n]   = state[n].data
            errors[n] = state[n].errors
            components[n] = { before: {}, loader: {}, success: {}, error: {} }
            components[n].before = _.pick(state[n].before, ['component', 'props'])
            components[n].loader = _.pick(state[n].loader, ['component', 'props'])
            components[n].success = _.pick(state[n].success, ['component', 'props'])
            components[n].error = _.pick(state[n].error, ['component', 'props'])
        })

        useEffect(() => {
            hocInfos.forEach( ({name, loader, before, action, success, error}) => {
                if(state.beforeReady 
                    && state.beforeReady[name] 
                    && state.beforeReady[name].ready)
                {
                    
                    performBeforeAction({name, before})

                    state[name].before.confirm.then( d => {
                        const data = state.beforeReady[name].data
                        console.log('Performing action on data', data)
                        performAction({name, loader, before, action, success, error}, data)
                    })
                    
                    state[name].before.deny.then( d => console.log(d))
                }
            })
        }, [state.beforeReady])

        return (
            <>  
                
                { Object.keys(state).filter(k => k !== 'beforeReady').map( (name, i) => {

                    const BeforeComponent = state[name].before.component
                    const beforeProps = state[name].before.props

                    const LoaderComponent = state[name].loader.component
                    const loaderProps = state[name].loader.props

                    const SuccessComponent = state[name].success.component
                    const successProps = state[name].success.props

                    const ErrorComponent = state[name].error.component
                    const errorProps = state[name].error.props

                    return (
                        <React.Fragment key={i}>
                            { state[name].before.show &&
                                <BeforeComponent {...beforeProps} />
                            }
                            { state[name].loader.show &&
                                <LoaderComponent {...loaderProps} />
                            }
                            { state[name].success.show &&
                                <SuccessComponent {...successProps} />
                            }
                            { state[name].error.show &&
                                <ErrorComponent {...errorProps} />
                            }
                        </React.Fragment>
                    )
                })}

                <Talk {...props} fnInfo={fnInfo} data={data} components={{...components}} errors={errors} />
                
            </>
        )
    }
}