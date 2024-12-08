import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, User, Phone } from 'lucide-react';
import { RegisterData } from '../../types/auth';
import { BusinessIndustry } from '../../types/business';
import { SubscriptionTier, SUBSCRIPTION_TIERS } from '../../types/subscription';
import { useAuth } from '../../contexts/AuthContext';
import { Select } from '../ui/Select';
import { Tooltip } from '../ui/Tooltip';
import { US_STATES } from '../../lib/utils';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  businessDetails: z.object({
    industry: z.nativeEnum(BusinessIndustry),
    taxId: z.string().min(1, 'Tax ID is required'),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      street2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(2, 'State is required'),
      country: z.string().min(1, 'Country is required'),
      zipCode: z.string().min(5, 'ZIP code is required'),
    }),
  }),
  subscription: z.object({
    tier: z.nativeEnum(SubscriptionTier),
    seats: z.number().min(1, 'At least one seat is required'),
  }),
});

export const RegisterTenantForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessDetails: {
        industry: BusinessIndustry.OTHER,
        address: {
          country: 'United States',
        },
      },
      subscription: {
        tier: SubscriptionTier.STARTER,
        seats: 1,
      },
    },
  });

  const selectedTier = watch('subscription.tier');
  const seats = watch('subscription.seats');

  const calculateTotal = () => {
    const pricePerSeat = SUBSCRIPTION_TIERS[selectedTier].pricePerSeat;
    return pricePerSeat * seats;
  };

  const onSubmit = async (data: RegisterData) => {
    try {
      await signUp(data);
      navigate('/registration-success');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  // Rest of the component remains the same...
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields remain the same... */}
    </form>
  );
};