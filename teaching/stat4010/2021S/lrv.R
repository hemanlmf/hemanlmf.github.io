queue_init = function() {
  queue = new.env()
  queue
}

queue_push = function(queue, value) {
  E = new.env()
  E$value = value
  E$nextE = NULL
  # If there is no elements in queue, insert E as both head and tail
  if (is.null(queue$head)) {
    E$prevE = NULL
    queue$tail = queue$head = E
  } else {
    E$prevE = queue$tail
    queue$tail$nextE = E
    queue$tail = E
  }
}

queue_pop = function(queue) {
  if (is.null(queue$head)) {
    NULL
  } else {
    value = queue$head$value
    queue$head = queue$head$nextE
    queue$head$prevE = NULL
  }
}

#' Initialize a recursive LRV estimator
#'
#' Initialize the components for recursive estimation of long-run variance
#' with LAS and store them in an environment variable.
#'
#' @param X1 the first observation \eqn{X_1} from a univariate time series.
#' @param s_coef the coefficient of the subsampling parameter \eqn{\Psi}.
#' @param t_coef the coefficient of the tapering parameter \eqn{\Theta}.
#' 
#' @return an environment variable storing the components for recursive
#' estimation.
#'
#' @references Leung, M. F. & Chan, K. W. (2021+), 'General and Super-optimal
#' Recursive Estimators of Long-Run Variance'.
lrv_init = function(X1, s_coef=1, t_coef=1) {
  E = new.env()
  E$Xn = X1
  E$s_coef = s_coef
  E$t_coef = t_coef
  with(E, {
    n = s = t = 1
    K = R = k = r = U = V = rep(0, 2)
    out = Q = Xn^2
    barX = Xn
    queue = queue_init()
    queue_push(queue, Xn)
  })
  E
}

#' Update a recursive LRV estimator
#'
#' Update the components for recursive estimation of long-run variance
#' with LAS and output the latest estimate.
#'
#' @param components the environment storing the components for recursive
#' estimation with LAS, which should be initialized with
#' \code{\link{lrv_init}} in the beginning.
#' @param Xn the latest observation \eqn{X_n} from the time series.
#' 
#' @return the latest LRV estimate.
#'
#' @references Leung, M. F. & Chan, K. W. (2021+), 'General and Super-optimal
#' Recursive Estimators of Long-Run Variance'.
lrv = function(components, Xn) {
  components$Xn = Xn
  with(components, {
    n = n +1
    sn = min(max(floor(s_coef*n^(1/3)), 1), n)
    tn = min(max(floor(t_coef*n^(1/3)), 1), n)
    Xnm1 = queue$tail$value
    Xnms = queue$head$value
    if (sn == s) {
      K[1] = K[1] +Xnm1 -Xnms
      K[2] = K[2] +K[1] -(s-1)*Xnms
      queue_pop(queue)
    } else {
      K[1] = K[1] +Xnm1
      K[2] = K[2] +K[1]
      k[1] = k[1] +1
      k[2] = k[2] +s
    }
    queue_push(queue, Xn)
    R = R +Xn*K
    Q = Q +Xn^2
    r = r +k
    U = U +k*Xn
    V = V +K
    barX = ((n-1)*barX +Xn)/n
    s = sn
    t = tn
    t_inv = 1/tn
    out = (Q +2*(R[1]-R[2]*t_inv) +(2*(r[1]-r[2]*t_inv) -n)*barX^2
           -2*barX*(U[1]-U[2]*t_inv +V[1]-V[2]*t_inv))/n
    out
  })
}