import { Step } from '@/types'
import { ref, computed } from 'vue'

export function useStepper(_steps: (Step | string)[], initialStep = '') {
  const steps = ref<Step[]>(_steps.map(_getStepOptions))
  const currentStep = ref(_getStep(initialStep) || steps.value[0])
  const currentIdx = computed(() => steps.value.indexOf(currentStep.value))
  const totalSteps = computed(() => steps.value.length)
  const totalStepsVisible = computed(
    () => steps.value.filter(el => !el.isHidden).length,
  )

  function forward() {
    const nextStep = steps.value[currentIdx.value + 1]
    if (nextStep) currentStep.value = nextStep
  }

  function back() {
    const prevStep = steps.value[currentIdx.value - 1]
    if (prevStep) currentStep.value = prevStep
  }

  function toStep(step: string) {
    const _step = _getStep(step)
    if (_step) {
      currentStep.value = _step
    }
  }

  function _getStep(criteria: string) {
    const step = _getStepOptions(criteria).name
    return steps.value.find((el: Step) => el.name === step)
  }

  function _getStepOptions(step: Step | string): Step {
    if (typeof step === 'string') return { name: step }
    return step
  }

  return {
    steps,
    currentStep,
    currentIdx,
    forward,
    back,
    toStep,
    totalSteps,
    totalStepsVisible,
  }
}
