import { useState, useCallback, useMemo } from 'react'
import { Form } from '../components/form'
import { Footer } from '../components/footer'
import { ConfirmExitPanel, type ConfirmAction } from '../components/confirm-exit-panel'
import type { ConfigSchema } from '../types/config'
import type Conf from 'conf'

export interface SettingsScreenProps {
	config: Conf<ConfigSchema>
	onBack: () => void
}

interface SettingsFormState {
	modelId: string
	apiKey: string
	batchSize: string
	outputDir: string
}

export function SettingsScreen({ config, onBack }: SettingsScreenProps) {
	// Local form state
	const [formState, setFormState] = useState<SettingsFormState>(() => ({
		modelId: config.get('modelId'),
		apiKey: config.get('apiKey'),
		batchSize: String(config.get('batchSize')),
		outputDir: config.get('outputDir'),
	}))

	// Confirm panel state
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	// Initial values for dirty detection
	const initialValues = useMemo<SettingsFormState>(() => ({
		modelId: config.get('modelId'),
		apiKey: config.get('apiKey'),
		batchSize: String(config.get('batchSize')),
		outputDir: config.get('outputDir'),
	}), [config])

	// Check if form is dirty
	const isDirty = useMemo(() => {
		return (
			formState.modelId !== initialValues.modelId ||
			formState.apiKey !== initialValues.apiKey ||
			formState.batchSize !== initialValues.batchSize ||
			formState.outputDir !== initialValues.outputDir
		)
	}, [formState, initialValues])

	// Save and exit
	const handleSave = useCallback(() => {
		config.set('modelId', formState.modelId)
		config.set('apiKey', formState.apiKey)
		config.set('batchSize', Number(formState.batchSize) || 5)
		config.set('outputDir', formState.outputDir)
		onBack()
	}, [config, formState, onBack])

	// Handle confirm panel action
	const handleConfirmAction = useCallback((action: ConfirmAction) => {
		switch (action) {
			case 'save':
				handleSave()
				break
			case 'discard':
				onBack()
				break
			case 'cancel':
				setIsConfirmOpen(false)
				break
		}
	}, [handleSave, onBack])

	// Handle escape key
	const handleEscape = useCallback(() => {
		if (!isDirty) {
			onBack()
			return
		}
		setIsConfirmOpen(true)
	}, [isDirty, onBack])

	const updateField = useCallback(<K extends keyof SettingsFormState>(
		field: K,
		value: SettingsFormState[K]
	) => {
		setFormState(prev => ({ ...prev, [field]: value }))
	}, [])

	return (
		<box
			flexDirection="column"
			flexGrow={1}
			justifyContent="center"
			alignItems="flex-start"
			width={60}
		>
			<Form
				isLoading={false}
				onEscape={isConfirmOpen ? undefined : handleEscape}
				enableSubmitShortcut={false}
				enableCommandPanelShortcut={false}
			>
				<Form.TextField
					title="Model ID"
					placeholder="gemini-2.5-pro"
					description="The model ID to use for the translation."
					value={formState.modelId}
					onChange={val => updateField('modelId', val)}
				/>
				<Form.TextField
					title="API Key"
					placeholder="Enter your API key"
					description="Your API key for the translation service."
					value={formState.apiKey}
					onChange={val => updateField('apiKey', val)}
				/>
				<Form.TextField
					title="Batch Size"
					placeholder="5"
					description="Number of translations done sequentially."
					value={formState.batchSize}
					onChange={val => updateField('batchSize', val)}
				/>
				<Form.TextField
					title="Output Directory"
					placeholder="./output"
					description="Directory where translated CSV files will be saved."
					value={formState.outputDir}
					onChange={val => updateField('outputDir', val)}
				/>
			</Form>

			<Footer configurationOpen={true} />

			{isConfirmOpen && (
				<ConfirmExitPanel onAction={handleConfirmAction} />
			)}
		</box>
	)
}

